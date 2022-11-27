-- Creando dominios --

--Dni
create domain public.t_dni as varchar
check ((value similar to '%[0-9]%' and length(value) = 8) and (value not similar to '%[A-Z]%') and (value not similar to '%[a-z]%') and (value not similar to '%[#?!@$%^&*-.,]%'));

--Solo texto
create domain public.t_text as varchar
check (value not similar to '%[0-9]%' and value not similar to '%[!"#$&()*+,-./[]%?]%');

--Tipo monto
create domain public.t_amount as float
check (value > 0);

--Tipo stock
create domain public.t_stock as integer
check (value >= 0);


--Creando tablas
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"dni" t_dni NOT NULL UNIQUE,
	"name" t_text NOT NULL,
	"lastname" t_text NOT NULL,
	"phone" varchar(20),
	"email" varchar(50) NOT NULL UNIQUE,
	"is_admin" boolean  NOT NULL DEFAULT FALSE,
	"cloudinary_id" varchar(128) NOT NULL,
	"title_img" varchar(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS "state" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" t_text NOT NULL
);

CREATE TABLE IF NOT EXISTS "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"departure_date" timestamp DEFAULT LOCALTIMESTAMP NOT NULL,
	"arrival_date" timestamp NOT NULL,
	"state_id" integer NOT NULL REFERENCES "state"("id")
);

CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(400) NOT NULL,
	"price" t_amount NOT NULL,
	"stock" t_stock NOT NULL,
	"cloudinary_id" varchar(128) NOT NULL,
	"title_img" varchar(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS "province" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" t_text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pet_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" t_text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pet" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" t_text NOT NULL,
	"user_id" integer NOT NULL REFERENCES "user"("id"),
	"pet_type_id" integer NOT NULL REFERENCES "pet_type"("id")
);

CREATE TABLE IF NOT EXISTS "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_date" timestamp DEFAULT LOCALTIMESTAMP NOT NULL,
	"comment" varchar(400) NOT NULL,
	"response" varchar(400),
	"response_date" timestamp,
	"user_id" integer NOT NULL REFERENCES "user"("id"),
	"product_id" integer NOT NULL REFERENCES "product"("id")
);

CREATE TABLE IF NOT EXISTS "favorite" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "product_favorite" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL REFERENCES "product"("id"),
	"favorite_id" integer NOT NULL REFERENCES "favorite"("id")
)

CREATE TABLE IF NOT EXISTS "service" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(400) NOT NULL,
	"price" t_amount NOT NULL,
	"cloudinary_id" varchar(128) NOT NULL,
	"title_img" varchar(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS "location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" t_text NOT NULL,
	"province_id" integer NOT NULL REFERENCES "province"("id")
);

CREATE TABLE IF NOT EXISTS "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"street_name" varchar(200) NOT NULL,
	"house_number" integer NOT NULL,
	"user_id" integer NOT NULL REFERENCES "user"("id"),
	"location_id" integer NOT NULL REFERENCES "location"("id")
);

CREATE TABLE IF NOT EXISTS "buy" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_price" t_amount NOT NULL,
	"date" date DEFAULT current_date NOT NULL,
	"shipments_id" integer NOT NULL REFERENCES "shipments"("id"),
	"user_id" integer NOT NULL REFERENCES "user"("id"),
	"address_id" integer NOT NULL REFERENCES "address"("id")
);

CREATE TABLE IF NOT EXISTS "product_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL REFERENCES "product"("id"),
	"cart_id" integer NOT NULL REFERENCES "cart"("id")
);

CREATE TABLE IF NOT EXISTS "product_buy" (
	"id" serial PRIMARY KEY NOT NULL,
	"price" float NOT NULL,
	"quantity" integer NOT NULL,
	"product_id" integer NOT NULL REFERENCES "product"("id"),
	"buy_id" integer NOT NULL REFERENCES "buy"("id")
);

CREATE TABLE IF NOT EXISTS "service_pet" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_date" date DEFAULT current_date NOT NULL,
	"ending_date" date NOT NULL,
	"price" float NOT NULL,
	"service_id" integer NOT NULL REFERENCES "service"("id"),
	"pet_id" integer NOT NULL REFERENCES "pet"("id")
);

--Convirtiendo las multiplicidades de 1 a 1
ALTER TABLE "cart" ADD CONSTRAINT "unique_cart_user_id" UNIQUE("user_id");


--Borrar tablas
DROP TABLE "user" CASCADE;
DROP TABLE "state" CASCADE;
DROP TABLE "shipments" CASCADE;
DROP TABLE "product" CASCADE;
DROP TABLE "province" CASCADE;
DROP TABLE "pet_type" CASCADE;
DROP TABLE "pet" CASCADE;
DROP TABLE "cart" CASCADE;
DROP TABLE "comment" CASCADE;
DROP TABLE "favorite" CASCADE;
DROP TABLE "service" CASCADE;
DROP TABLE "buy" CASCADE;
DROP TABLE "location" CASCADE;
DROP TABLE "address" CASCADE;
DROP TABLE "product_cart" CASCADE;
DROP TABLE "product_buy" CASCADE;
DROP TABLE "service_pet" CASCADE;
