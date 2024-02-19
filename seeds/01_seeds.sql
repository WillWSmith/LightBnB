INSERT INTO users (name, email, password)
VALUES ('Will Smoth', 'WillSmoth@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Kristyn Gaylord', 'KristynGaylord@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Kamren Kuhn', 'kamrenkuhn@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'The Best Place', 'This is the best place', 'https://images.unsplash.com/photo-1566478210353-3b3f97d6b6f7', 'https://images.unsplash.com/photo-1566478210353-3b3f97d6b6f7', 100, 2, 1, 1, 'Canada', '1234 Main St', 'Vancouver', 'BC', 'V6A 1A7', TRUE),
(2, 'The Second Best Place', 'This is the second best place', 'https://images.unsplash.com/photo-1566478210353-3b3f97d6b6f7', 'https://images.unsplash.com/photo-1566478210353-3b3f97d6b6f7', 200, 3, 2, 2, 'Canada', '1234 Main St', 'Vancouver', 'BC', 'V6A 1A7', TRUE),
(3, 'The Third Best Place', 'This is the third best place', 'https://images.unsplash.com/photo-1566478210353-3b3f97d6b6f7', 'https://images.unsplash.com/photo-1566478210353-3b3f97d6b6f7', 300, 4, 3, 3, 'Canada', '1234 Main St', 'Vancouver', 'BC', 'V6A 1A7', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-12-12', '2020-12-15', 1, 2),
('2020-12-12', '2020-12-15', 2, 3),
('2020-12-12', '2020-12-15', 3, 1);

INSERT INTO property_reviews (property_id, guest_id, reservation_id, rating, message)
VALUES (1, 2, 1, 5, 'This place was great!'),
(2, 3, 2, 4, 'This place was great!'),
(3, 1, 3, 3, 'This place was great!');