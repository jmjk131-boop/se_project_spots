import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a58df17f-cb68-45a5-878b-d8d8dc949ca9", // Replace with your actual token
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error(err); // log the error to the console
  });

// edit form elements
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button",
);
const editProfileFormEl = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

//edit avatar elements
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarFormEl = editAvatarModal.querySelector(".modal__form");
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button",
);
const editAvatarModalCloseButton = editAvatarModal.querySelector(
  ".modal__close-button",
);
const editAvatarInput = editAvatarModal.querySelector("#profile-avatar-input");

// new post elements
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostSubmitButton = newPostModal.querySelector(".modal__submit-button");
const newPostFormEl = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#image-caption-input");

// profile elements
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// card related elements
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button",
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    cardLikeButtonEl.classList.add("card__like-button_active");
  }

  cardLikeButtonEl.addEventListener("click", function () {
    api
      .handleLikeStatus(data._id, data.isLiked)
      .then(() => {
        data.isLiked = !data.isLiked;
        cardLikeButtonEl.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  });

  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");
  cardDeleteButtonEl.addEventListener("click", function () {
    api
      .deleteCard(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch(console.error);
  });

  cardImageEl.addEventListener("click", function () {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;

    openModal(previewModal);
  });

  return cardElement;
}
function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}
function handleOverlayClose(evt) {
  if (evt.target.classList.contains("modal")) closeModal(evt.target);
}

function openModal(modal) {
  modal.addEventListener("mousedown", handleOverlayClose);
  modal.addEventListener("keydown", handleEscape);
  modal.classList.add("modal_is-opened");
}
function closeModal(modal) {
  modal.removeEventListener("mousedown", handleOverlayClose);
  modal.removeEventListener("keydown", handleEscape);
  modal.classList.remove("modal_is-opened");
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileFormEl,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

editAvatarButton.addEventListener("click", function () {
  openModal(editAvatarModal);
});

editAvatarModalCloseButton.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      closeModal(editProfileModal);
    })
    .catch(console.error);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  disableButton(newPostSubmitButton, settings);
  api
    .addNewCards({
      name: newPostCaptionInput.value,
      link: newPostImageInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(newPostModal);
    })
    .catch(console.error);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(editAvatarInput.value);
  api
    .editAvatarInfo({
      avatar: editAvatarInput.value,
    })
    .then((data) => {
      const avatarImg = document.querySelector(".profile__avatar");
      console.log(data);
      avatarImg.src = data.avatar;

      closeModal(editAvatarModal);
    })
    .catch(console.error);
}
editAvatarFormEl.addEventListener("submit", handleAvatarSubmit);
editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);
newPostFormEl.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
