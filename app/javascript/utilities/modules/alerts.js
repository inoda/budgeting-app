import Swal from 'sweetalert2';

const Alerts = {
  genericError() {
    Swal.fire({
      title: 'Uh oh!',
      text: 'Something went wrong. Refreshing the page and trying again might help.',
      icon: 'error',
      confirmButtonText: 'Refresh',
    }).then((result) => {
      if (!result.value) { return; }
      window.location.reload();
    });
  },

  error(errorText, onClose) {
    Swal.fire({
      title: 'Uh oh!',
      text: errorText,
      icon: 'error',
      confirmButtonText: 'Ok',
    }).then(() => {
      if (onClose) { onClose(); }
    });
  },

  success(successText, onClose) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      timer: 3000,
      timerProgressBar: true,
      title: 'Woohoo!',
      text: successText,
      confirmButtonText: 'Ok',
      icon: 'success',
    }).then(() => {
      if (onClose) { onClose(); }
    });
  },

  genericDelete(label) {
    return Swal.fire({
      title: 'Confirm delete',
      text: `Are you sure you want to delete this ${label}?`,
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#bd4d4d',
    });
  },
};

export default Alerts;
