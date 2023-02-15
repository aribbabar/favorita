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
        favorites: state.favorites,
        categories: state.categories,
        lastVisibleDoc: state.lastVisibleDoc
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
            category: action.favorite.category,
            image: action.favorite.image
          }
        ],
        categories: state.categories,
        lastVisibleDoc: state.lastVisibleDoc
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
            category: action.favorite.category,
            image: action.favorite.image
          }
        ],
        categories: state.categories,
        lastVisibleDoc: state.lastVisibleDoc
      };
    case "REMOVE_FAVORITE":
      return {
        uid: state.uid,
        favorites: state.favorites.filter((fav) => fav.id !== action.id),
        categories: state.categories,
        lastVisibleDoc: state.lastVisibleDoc
      };

    case "SET_CATEGORIES":
      return {
        uid: state.uid,
        favorites: state.favorites,
        categories: action.categories,
        lastVisibleDoc: state.lastVisibleDoc
      };
    case "SORT_BY_GIVEN_PROPERTY":
      return {
        uid: state.uid,
        favorites:
          action.orderBy === "ASC"
            ? [...sortByPropertyAsc(state.favorites, action.property)]
            : [...sortByPropertyDesc(state.favorites, action.property)],
        categories: state.categories,
        lastVisibleDoc: state.lastVisibleDoc
      };
    case "UPDATE_LAST_VISIBLE_DOCUMENT":
      return {
        uid: state.uid,
        favorites: state.favorites,
        categories: state.categories,
        lastVisibleDoc: action.lastVisibleDoc
      };
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
