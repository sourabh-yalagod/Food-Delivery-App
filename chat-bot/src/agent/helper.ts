import { pool } from "@/lib/db.js";

async function getAllRestaurants() {
    const query = 'SELECT * FROM restaurants ORDER BY rating DESC';
    const result = await pool.query(query);
    return result.rows;
}

async function getRestaurantById(restaurantId: any) {
    const query = 'SELECT * FROM restaurants WHERE id = $1';
    const result = await pool.query(query, [restaurantId]);
    return result.rows[0];
}

async function searchRestaurantsByLocation(location: any) {
    const query = 'SELECT * FROM restaurants WHERE location ILIKE $1 ORDER BY rating DESC';
    const result = await pool.query(query, [`%${location}%`]);
    return result.rows;
}

async function getTopRatedRestaurants(limit = 10) {
    const query = 'SELECT * FROM restaurants ORDER BY rating DESC LIMIT $1';
    const result = await pool.query(query, [limit]);
    return result.rows;
}

// ============= MENU FUNCTIONS =============

async function getMenuByRestaurantId(restaurantId: any) {
    const query = `
    SELECT m.* FROM menus m
    JOIN restaurants r ON m.restaurant_id = r.id
    WHERE r.id = $1
    ORDER BY m.rating DESC
  `;
    const result = await pool.query(query, [restaurantId]);
    return result.rows;
}

async function getMenuItemById(menuId: any) {
    const query = 'SELECT * FROM menus WHERE id = $1';
    const result = await pool.query(query, [menuId]);
    return result.rows[0];
}

async function searchMenuItems(searchTerm: any) {
    const query = `
    SELECT m.*, r.name as restaurant_name, r.location as restaurant_location
    FROM menus m
    JOIN restaurants r ON m.restaurant_id = r.id
    WHERE m.name ILIKE $1 OR m.description ILIKE $1
    ORDER BY m.rating DESC
  `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
}

async function getVegMenuItems() {
    const query = `
    SELECT m.*, r.name as restaurant_name
    FROM menus m
    JOIN restaurants r ON m.restaurant_id = r.id
    WHERE m.is_veg = true
    ORDER BY m.rating DESC
  `;
    const result = await pool.query(query);
    return result.rows;
}

async function getPopularMenuItems(limit = 20) {
    const query = `
    SELECT m.*, r.name as restaurant_name
    FROM menus m
    JOIN restaurants r ON m.restaurant_id = r.id
    ORDER BY m.votes DESC, m.rating DESC
    LIMIT $1
  `;
    const result = await pool.query(query, [limit]);
    return result.rows;
}

// ============= CART FUNCTIONS =============

async function getUserCart(userId: any) {
    const query = `
    SELECT c.*, ci.id as item_id, ci.quantity, ci.price, ci.menu_id,
           m.name as menu_name, m.image as menu_image
    FROM carts c
    LEFT JOIN cart_items ci ON c.id = ci.cart_id
    LEFT JOIN menus m ON ci.menu_id = m.id
    WHERE c.user_id = $1 AND c.status = 'active'
  `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

async function addToCart(userId: any, menuId: any, quantity: any, price: any) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get or create active cart
        let cartResult = await client.query(
            'SELECT id FROM carts WHERE user_id = $1 AND status = $2',
            [userId, 'active']
        );

        let cartId;
        if (cartResult.rows.length === 0) {
            const newCart = await client.query(
                'INSERT INTO carts (id, user_id, status, created_at) VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING id',
                [userId, 'active']
            );
            cartId = newCart.rows[0].id;
        } else {
            cartId = cartResult.rows[0].id;
        }

        // Add item to cart
        await client.query(
            'INSERT INTO cart_items (id, cart_id, menu_id, quantity, price) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
            [cartId, menuId, quantity, price]
        );

        await client.query('COMMIT');
        return { success: true, cartId };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function updateCartItemQuantity(itemId: any, quantity: any) {
    const query = 'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [quantity, itemId]);
    return result.rows[0];
}

async function removeFromCart(itemId: any) {
    const query = 'DELETE FROM cart_items WHERE id = $1';
    await pool.query(query, [itemId]);
    return { success: true };
}

async function clearCart(userId: any) {
    const query = `
    DELETE FROM cart_items 
    WHERE cart_id IN (SELECT id FROM carts WHERE user_id = $1 AND status = 'active')
  `;
    await pool.query(query, [userId]);
    return { success: true };
}

async function getCartTotal(userId: any) {
    const query = `
    SELECT COALESCE(SUM(ci.price * ci.quantity), 0) as total
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    WHERE c.user_id = $1 AND c.status = 'active'
  `;
    const result = await pool.query(query, [userId]);
    return result.rows[0].total;
}

// ============= ORDER/PAYMENT FUNCTIONS =============

async function getUserOrders(userId: any) {
    const query = `
    SELECT p.*, m.name as menu_name, m.image as menu_image
    FROM payments p
    LEFT JOIN menus m ON p.menu_id = m.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
  `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

async function getOrderById(orderId: any) {
    const query = 'SELECT * FROM payments WHERE order_id = $1';
    const result = await pool.query(query, [orderId]);
    return result.rows;
}

async function createOrder(userId: any, cartItems: any, totalAmount: any) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderId = `ORD-${Date.now()}`;

        for (const item of cartItems) {
            await client.query(
                `INSERT INTO payments (id, order_id, user_id, menu_id, amount, status, created_at) 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
                [orderId, userId, item.menu_id, item.price * item.quantity, 'pending']
            );
        }

        // Clear cart after order
        await client.query(
            `UPDATE carts SET status = 'completed' WHERE user_id = $1 AND status = 'active'`,
            [userId]
        );

        await client.query('COMMIT');
        return { success: true, orderId };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

// ============= USER FUNCTIONS =============

async function getUserById(userId: any) {
    const query = 'SELECT id, name, email FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
}

async function getUserByEmail(email: any) {
    const query = 'SELECT id, name, email FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

// ============= DISCOUNT FUNCTIONS =============

async function getDiscountsByRestaurant(restaurantId: any) {
    const query = 'SELECT * FROM discount WHERE restaurant_id = $1';
    const result = await pool.query(query, [restaurantId]);
    return result.rows;
}

async function getAvailableDiscounts() {
    const query = 'SELECT d.*, r.name as restaurant_name FROM discount d JOIN restaurants r ON d.restaurant_id = r.id';
    const result = await pool.query(query);
    return result.rows;
}

// ============= ANALYTICS FUNCTIONS =============

async function getRecommendations(userId: any, limit = 10) {
    const query = `
    SELECT DISTINCT m.*, r.name as restaurant_name, 
           COUNT(p.id) as order_count
    FROM menus m
    JOIN restaurants r ON m.restaurant_id = r.id
    LEFT JOIN payments p ON m.id = p.menu_id
    WHERE m.id NOT IN (
      SELECT DISTINCT menu_id FROM payments WHERE user_id = $1
    )
    GROUP BY m.id, r.name
    ORDER BY m.rating DESC, order_count DESC
    LIMIT $2
  `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
}

async function getUserOrderHistory(userId: any, limit = 10) {
    const query = `
    SELECT p.*, m.name as menu_name, m.image, r.name as restaurant_name
    FROM payments p
    JOIN menus m ON p.menu_id = m.id
    JOIN restaurants r ON m.restaurant_id = r.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
    LIMIT $2
  `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
}
export {
    getAllRestaurants,
    getRestaurantById,
    searchRestaurantsByLocation,
    getTopRatedRestaurants,

    // Menu
    getMenuByRestaurantId,
    getMenuItemById,
    searchMenuItems,
    getVegMenuItems,
    getPopularMenuItems,

    // Cart
    getUserCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,

    // Orders
    getUserOrders,
    getOrderById,
    createOrder,

    // Users
    getUserById,
    getUserByEmail,

    // Discounts
    getDiscountsByRestaurant,
    getAvailableDiscounts,

    // Analytics
    getRecommendations,
    getUserOrderHistory,
}