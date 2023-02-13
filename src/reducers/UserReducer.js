function sortByPropertyAsc(arr, property) {
  return arr.sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
}

function sortByPropertyDesc(arr, property) {
  return arr.sort((a, b) => {
    if (a[property] < b[property]) return 1;
    if (a[property] > b[property]) return -1;
    return 0;
  });
}

function userReducer(state, action) {
  switch (action.type) {
    case "SET_UID":
      return {
        uid: action.uid,
        favorites: state.favorites
      };
    case "ADD_FAVORITE":
      return {
        uid: state.uid,
        favorites: [
          ...state.favorites,
          {
            id: action.favoriteId,
            title: action.favorite.title,
            rating: action.favorite.rating,
            type: action.favorite.type,
            image: action.favorite.image
          }
        ]
      };
    case "UPDATE_FAVORITE":
      return {
        uid: state.uid,
        favorites: [
          ...state.favorites.filter((fav) => fav.id !== action.favorite.id),
          {
            id: action.favorite.id,
            title: action.favorite.title,
            rating: action.favorite.rating,
            type: action.favorite.type,
            image: action.favorite.image
          }
        ]
      };
    case "REMOVE_FAVORITE":
      return {
        uid: state.uid,
        favorites: state.favorites.filter((fav) => fav.id !== action.id)
      };
    case "SORT_BY_GIVEN_PROPERTY":
      return {
        uid: state.uid,
        favorites:
          action.orderBy === "ASC"
            ? sortByPropertyAsc(state.favorites, action.property)
            : sortByPropertyDesc(state.favorites, action.property)
      };
    case "SIGN_OUT":
      return {
        uid: "",
        favorites: []
      };
    default:
      return state;
  }
}

export default userReducer;
