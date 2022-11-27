alter sequence state_id_seq restart with 1;
INSERT INTO "state" ("name") VALUES
('En viaje'),
('Recivido'),
('En devolución')