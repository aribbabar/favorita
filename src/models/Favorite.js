export default class Favorite {
  /**
   *
   * @param {String} id
   * @param {String} title
   * @param {Number} rating
   * @param {String} type
   * @param {Object} image
   */
  constructor(id, title, rating, type, image) {
    this.id = id;
    this.title = title;
    this.rating = rating;
    this.type = type;
    this.image = {
      title: image.title ? image.name : "",
      path: image.path ? image.path : ""
    };
  }

  getFavorite() {
    return {
      id: this.id,
      title: this.title,
      rating: this.rating,
      type: this.type,
      image: this.image
    };
  }
}
