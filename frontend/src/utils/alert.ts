import Swal from "sweetalert2";

export function confirmAlert({
  title,
  text,
  confirmText = '확인',
  cancelText = '취소',
}: {
  title: string,
  text: string,
  confirmText?: string,
  cancelText?: string,
}) {
  return Swal.fire({
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
}
