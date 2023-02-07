
export const findFilmsWithCategoryAndLanguage = (
  offset: number,
  limit: number,
  orderBy: string,
  orderType: string
): any => {
  return `
  SELECT 
    film.film_id, 
    film.title, 
    film.release_year, 
    film_category.last_update, 
    category.name AS category_name, 
    language.name AS language_name
  FROM film
  INNER JOIN film_category
  ON film.film_id = film_category.film_id
  INNER JOIN category
  ON film_category.category_id = category.category_id
  INNER JOIN language
  ON film.language_id = language.language_id
  ORDER BY ${orderBy} ${orderType}
  OFFSET ${offset} 
  LIMIT ${limit}
  `
}

export const findTotalFilmsByActor = (
  offset: number,
  limit: number,
  orderBy: string,
  orderType: string
): any => {
  return `
  SELECT 
    actor.actor_id, 
    actor.first_name, 
    actor.last_name, 
    count(*) AS total_appearances
  FROM actor
  INNER JOIN film_actor
  ON actor.actor_id = film_actor.actor_id
  GROUP BY actor.actor_id
  ORDER BY ${orderBy} ${orderType}
  OFFSET ${offset} 
  LIMIT ${limit}
  `
}

export const findTotalFilmsByCategoryWithListOfNames = (
  offset: number,
  limit: number,
  orderBy: string,
  orderType: string
): any => {
  return `
  SELECT
    count(film_category.film_id),
    category.category_id,
    category.name,
    string_agg(film.title, ':::') AS films_title
  FROM film_category
  INNER JOIN category
  ON film_category.category_id = category.category_id
  INNER JOIN film
  ON film.film_id = film_category.film_id
  GROUP BY category.category_id
  ORDER BY ${orderBy} ${orderType}
  OFFSET ${offset} 
  LIMIT ${limit}
  `
}

export const findTitleTimesRentedAndTotalAmount = (
  offset: number,
  limit: number,
  orderBy: string,
  orderType: string
): any => {
  return `
  SELECT 
    film.title,
    count(*) AS times_rented,
    SUM(payment.amount) AS total_amount
  FROM film
  INNER JOIN inventory
  ON film.film_id = inventory.film_id
  INNER JOIN rental
  ON inventory.inventory_id = rental.inventory_id
  INNER JOIN payment
  ON rental.rental_id = payment.rental_id
  GROUP BY film.film_id
  ORDER BY ${orderBy} ${orderType}
  OFFSET ${offset} 
  LIMIT ${limit}
  `
}

export const findCustomerDataAndAmountSpend = (
  offset: number,
  limit: number,
  orderBy: string,
  orderType: string
): any => {
  return `
  SELECT 
    payment.customer_id,
    SUM(payment.amount) AS total_spend,
    customer.first_name,
    customer.last_name,
    customer.email
  FROM payment
  INNER JOIN customer
  ON payment.customer_id = customer.customer_id
  GROUP BY 
    payment.customer_id, 
    customer.first_name,
    customer.last_name,
    customer.email
  ORDER BY ${orderBy} ${orderType}
  OFFSET ${offset} 
  LIMIT ${limit}
  `
}
