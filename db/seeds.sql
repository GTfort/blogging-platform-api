-- db/seeds.sql
USE blogging_platform;

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Posts about technology and programming'),
('Lifestyle', 'lifestyle', 'Posts about daily life and habits'),
('Travel', 'travel', 'Posts about travel experiences'),
('Food', 'food', 'Posts about cooking and recipes'),
('Health', 'health', 'Posts about health and wellness');

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('Node.js', 'nodejs'),
('React', 'react'),
('Programming', 'programming'),
('Web Development', 'web-development'),
('Travel Tips', 'travel-tips'),
('Healthy Living', 'healthy-living'),
('Recipes', 'recipes');

-- Insert sample posts
INSERT INTO posts (title, slug, content, excerpt, category, status, view_count) VALUES
('Getting Started with Express.js',
 'getting-started-with-expressjs',
 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. In this post, we will explore the basics of setting up an Express server, routing, middleware, and more...',
 'Learn how to build web applications with Express.js framework.',
 'Technology',
 'published',
 150),

('The Benefits of Daily Exercise',
 'benefits-of-daily-exercise',
 'Regular physical activity is one of the most important things you can do for your health. Being active can help you maintain a healthy weight, reduce your risk of chronic diseases, and improve your mental health and mood...',
 'Discover how daily exercise can transform your physical and mental wellbeing.',
 'Health',
 'published',
 89),

('10 Must-Visit Places in Japan',
 'must-visit-places-in-japan',
 'Japan is a country of contrasts where ancient traditions meet cutting-edge technology. From the bustling streets of Tokyo to the serene temples of Kyoto, here are 10 places you must visit when traveling to Japan...',
 'Explore the top destinations in Japan for an unforgettable travel experience.',
 'Travel',
 'published',
 203);

-- Associate tags with posts
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), (1, 2), (1, 5),  -- Express.js post tags
(2, 7),                  -- Exercise post tags
(3, 6);                  -- Japan post tags
