CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_featured_idx" ON "products" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "products_active_idx" ON "products" USING btree ("active");--> statement-breakpoint
CREATE INDEX "products_active_featured_idx" ON "products" USING btree ("active","featured");--> statement-breakpoint
CREATE INDEX "products_active_category_idx" ON "products" USING btree ("active","category_id");