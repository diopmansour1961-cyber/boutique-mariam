function starsHTML(rating) {
  const full = Math.round(rating);
  let out = "";
  for (let i = 1; i <= 5; i++) {
    out += i <= full ? "★" : "☆";
  }
  return `<span class="review-card__stars" aria-label="${rating} sur 5 étoiles">${out}</span>`;
}

function reviewCardHTML(review) {
  return `
    <figure class="review-card">
      ${starsHTML(review.rating)}
      <blockquote>“${review.comment}”</blockquote>
      <figcaption>${review.name} — ${review.city}</figcaption>
    </figure>
  `;
}

function renderReviews(targetId) {
  const el = document.getElementById(targetId || "reviews-grid");
  if (!el) return;
  if (typeof REVIEWS === "undefined" || !REVIEWS.length) {
    el.closest(".reviews-section")?.setAttribute("hidden", "");
    return;
  }
  el.innerHTML = REVIEWS.map(reviewCardHTML).join("");
}

document.addEventListener("DOMContentLoaded", () => renderReviews("reviews-grid"));
