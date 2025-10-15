import Swal from 'sweetalert2';

// For More information got to this link: https://sweetalert2.github.io/

// Success Alert
export const showSuccessAlert = (message) => {
    Swal.fire({
        title: message,
        icon: 'success',
        draggable: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
    });
};

export const showDeleteConfirmation = async (onConfirm) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        onConfirm(); // Callback for delete action
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    }
};
export const showDeleteConfirmationWithText = async (onConfirm) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        input: 'text',
        inputPlaceholder: 'Type DELETE to confirm',
        inputValidator: (value) => {
            if (value == '') {
                return 'You must type reason to cancel!';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
    });

    if (result.isConfirmed && result.value !== '') {
        // Call delete action
        onConfirm(result.value);

        // Show success message
        await Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    } else {
        console.log('Deletion cancelled or incorrect confirmation input');
    }
};