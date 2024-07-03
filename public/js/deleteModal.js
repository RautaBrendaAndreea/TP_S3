document.addEventListener('DOMContentLoaded', function() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  const modal = document.getElementById('deleteModal');
  if (!modal) {
      console.error('Modal element not found!');
      return;
  }
  const confirmButton = modal.querySelector('.confirm');
  const cancelButton = modal.querySelector('.cancel');

  deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
          const userId = this.getAttribute('data-id');
          if (!userId) {
              console.error('ID utilisateur non trouvé sur le bouton de suppression');
              return;
          }
          modal.style.display = 'block';
          confirmButton.setAttribute('data-id', userId);
      });
  });

  confirmButton.addEventListener('click', function() {
      const userId = confirmButton.getAttribute('data-id');
      if (!userId) {
          console.error('ID utilisateur non trouvé dans le bouton de confirmation');
          return;
      }

      fetch(`http://localhost:8000/delete/${userId}`, { method: 'DELETE' })
          .then(response => {
              if (response.ok) {
                  alert('Utilisateur supprimé avec succès');
                  window.location.reload();
              } else {
                  alert('Une erreur est survenue lors de la suppression');
              }
          })
          .catch(error => {
              console.error('Erreur lors de la suppression', error);
              alert('Erreur lors de la suppression');
          });
  });

  cancelButton.addEventListener('click', function() {
      modal.style.display = 'none';
  });
});
