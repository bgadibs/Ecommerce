CREATE DATABASE IF NOT EXISTS ecommerce_db;

USE ecommerce_db;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- CATEGORIES
-- =========================================

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);


-- =========================================
-- PRODUCTS
-- =========================================

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,

    category_id INT NOT NULL,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    price DECIMAL(10,2) NOT NULL,

    discount DECIMAL(5,2) DEFAULT 0,

    stock INT DEFAULT 0,

    image VARCHAR(500),

    brand VARCHAR(100),

    size VARCHAR(50),

    color VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);


-- =========================================
-- CART
-- =========================================

CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================
-- WISHLIST
-- =========================================

CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================
-- ORDERS
-- =========================================

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',

    shipping_address TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================
-- ORDER ITEMS
-- =========================================

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);