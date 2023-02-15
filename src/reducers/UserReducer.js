function sortByProperty(arr, prop, order) {
  if (order === "ASC") {
    return arr.sort(function (a, b) {
      if (typeof a[prop] === "string" && typeof b[prop] === "string") {
        return a[prop].localeCompare(b[prop]);
      } else {
        return a[prop] - b[prop];
      }
    });
  } else if (order === "DESC") {
    return arr.sort(function (a, b) {
      if (typeof a[prop] === "string" && typeof b[prop] === "string") {
        return b[prop].localeCompare(a[prop]);
      } else {
        return b[prop] - a[prop];
      }
    });
  } else {
    return arr;
  }
}

function userReducer(state, action) {
  switch (action.type) {
    case "SET_UID":
      return { ...state, uid: action.uid };
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [
          ...state.favorites,
          {
            id: action.favoriteId,
            title: action.favorite.title,
            rating: action.favorite.rating,
            category: action.favorite.category,
            image: action.favorite.image
          }
        ]
      };
    case "UPDATE_FAVORITE":
      return {
        ...state,
        favorites: [
          ...state.favorites.filter((fav) => fav.id !== action.favorite.id),
          {
            id: action.favorite.id,
            title: action.favorite.title,
            rating: action.favorite.rating,
            category: action.favorite.category,
            image: action.favorite.image
          }
        ]
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== action.id)
      };

    case "SET_CATEGORIES":
      return { ...state, categories: action.categories };
    case "SORT_BY_GIVEN_PROPERTY":
      return {
        ...state,
        favorites:
          action.orderBy === "ASC"
            ? [...sortByProperty(state.favorites, action.property, "ASC")]
            : [...sortByProperty(state.favorites, action.property, "DESC")]
      };
    case "UPDATE_LAST_VISIBLE_DOCUMENT":
      return { ...state, lastVisibleDoc: action.lastVisibleDoc };
    case "UPDATE_TOTAL_FAVORITES_COUNT":
      return { ...state, totalFavoritesCount: action.totalFavoritesCount };
    case "SIGN_OUT":
      return {
        uid: "",
        favorites: [],
        categories: [],
        lastVisibleDoc: undefined
      };
    default:
      return state;
  }
}

export default userReducer;
