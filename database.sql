CREATE DATABASE market_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE market_management_db;

-- Users (Kullanıcılar) Tablosu
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'market', 'baza') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Products (Ürünler) Tablosu
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Market Orders (Market Siparişleri) Tablosu
CREATE TABLE market_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 0,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) GENERATED ALWAYS AS (received_quantity * price) STORED,
    status ENUM('pending', 'approved', 'completed') DEFAULT 'pending',
    order_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_market_date (market_id, order_date),
    INDEX idx_status (status)
);

-- Market Daily Reports (Market Günlük Raporları) Tablosu
CREATE TABLE market_daily_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    report_date DATE NOT NULL,
    total_received DECIMAL(10,2) DEFAULT 0,
    damaged_goods DECIMAL(10,2) DEFAULT 0,
    cash_register DECIMAL(10,2) DEFAULT 0,
    cash DECIMAL(10,2) DEFAULT 0,
    salary DECIMAL(10,2) DEFAULT 0,
    expenses DECIMAL(10,2) DEFAULT 0,
    difference DECIMAL(10,2) DEFAULT 0,
    remainder DECIMAL(10,2) GENERATED ALWAYS AS (
        total_received - damaged_goods - cash_register - cash - salary - expenses - difference
    ) STORED,
    status ENUM('pending', 'approved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_market_date (market_id, report_date),
    INDEX idx_report_date (report_date)
);

-- Warehouse Prices (Depo Fiyatları) Tablosu
CREATE TABLE warehouse_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_product_date (product_id, start_date, end_date)
);

-- Örnek Kullanıcılar
INSERT INTO users (email, password, name, role) VALUES
('admin@panel.com', '$2a$12$1234567890123456789012uQRWKQmFLk5ZL5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Admin Panel', 'admin'),
('baza@panel.com', '$2a$12$1234567890123456789012uQRWKQmFLk5ZL5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Baza İdarəetmə', 'baza');

-- 15 Market Kullanıcısı
INSERT INTO users (email, password, name, role)
SELECT 
    CONCAT('market', number, '@panel.com'),
    '$2a$12$1234567890123456789012uQRWKQmFLk5ZL5Z5Z5Z5Z5Z5Z5Z5Z5Z',
    CONCAT('Market ', number),
    'market'
FROM (
    SELECT 1 AS number UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
) numbers;

-- Örnek Ürünler
INSERT INTO products (name) VALUES
('Alma'), ('Armud'), ('Portağal'), ('Çörək'), ('Süd'),
('Yumurta'), ('Ət'), ('Toyuq'), ('Düyü'), ('Kartof'),
('Soğan'), ('Pomidor'), ('Xiyar'), ('Yağ'), ('Un');

-- Örnek Depo Fiyatları (Son 30 gün için)
INSERT INTO warehouse_prices (product_id, price, start_date)
SELECT 
    p.id,
    ROUND(RAND() * (10.00 - 1.00) + 1.00, 2),
    CURDATE()
FROM products p;