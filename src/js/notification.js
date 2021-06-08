import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import {
  alert,
  notice,
  info,
  success,
  error,
  defaultStack,
} from '@pnotify/core';

function notifySearchEvent({ message, title, callback }) {
  defaultStack.close();
  callback({
    title,
    text: message,
    delay: 5000,
  });
}

export function alertNoMoreImages() {
  notifySearchEvent({
    message: 'Sorry! No more images for You!..',
    title: 'Search query error!',
    callback: error,
  });
}

export function alertBadQuery() {
  notifySearchEvent({
    message: 'No images for You! Try another query',
    title: 'Search query error!',
    callback: error,
  });
}

export function alertUnforseenError() {
  notifySearchEvent({
    message: 'Unexpected error occurred!',
    title: 'Search query error!',
    callback: error,
  });
}

export function alertLastImages() {
  notifySearchEvent({
    message: 'These are the last images found!...',
    title: 'Search query alert!',
    callback: alert,
  });
}

export function alertSeachPerformed() {
  notifySearchEvent({
    message: 'Enjoy the photos from Pixabay',
    title: 'Search successful',
    callback: success,
  });
}
