import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public toastr: ToastrManager) { }

  showSuccess(notification_message: string, notification_type: string, notification_param: any) {
    this.toastr.successToastr(notification_message, notification_type, notification_param);
  }

  showError(notification_message: string, notification_type: string, notification_param: any) {
      this.toastr.errorToastr(notification_message, notification_type, notification_param);
  }

  showWarning() {
      this.toastr.warningToastr('This is warning toast.', 'Alert!');
  }

  showInfo() {
      this.toastr.infoToastr('This is info toast.', 'Info');
  }

  showToast(notification_stub: any) {
    const notification_param = {
      toastTimeout: 3000,
      position: 'bottom-left',
      newestOnTop: true,
      showCloseButton: true,
      animate: 'slideFromLeft',
    };
    if (notification_stub.status === 'Success') {
      this.showSuccess(notification_stub.message, notification_stub.status, notification_param);
    } else if (notification_stub.status === 'Error') {
      this.showError(notification_stub.message, notification_stub.status, notification_param);
    }
  }
}
