-- SQL Schema for importing into Draw.io or Lucidchart

CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `products` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `image` TEXT,
  `description` TEXT,
  `rating` DECIMAL(3,2) DEFAULT 5.0,
  `stock` INT DEFAULT 10,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `orders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Processing',
  `items` JSON NOT NULL,
  `order_date` DATE NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `reviews` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
);

CREATE TABLE `coupons` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(50) UNIQUE NOT NULL,
  `discount` INT NOT NULL,
  `expiry_date` DATE NOT NULL,
  `min_purchase` INT DEFAULT 0
);
