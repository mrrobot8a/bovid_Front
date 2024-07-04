import { Injectable, Component } from '@angular/core';
import Swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-alert',
  template: '',
})

export class AlertService {

  constructor() { }

  public alerProgressBar(options: { title: string, icon: any, message: string, duration?: number, position?: any }): Promise<any> {
    const { title, message, duration = 0, icon, position } = options;
    return this.alerdanger(title, icon, message, duration, position);
  };


  private alerdanger(title: string, icon?: any, htmlMessage?: string | any, duration?: number | any, position?: any): Promise<any> {
    let timerInterval: any;
    Swal.fire({
      title: title,
      text: htmlMessage,
      icon: icon,
      html: htmlMessage,
      timer: duration,
      position: position,
      toast: true,
      showConfirmButton: false,
      grow: 'row',
      width: '20%',
      timerProgressBar: true,


      customClass: {
        timerProgressBar: 'swal2-timer-progress-bar',
        loader: 'loader-class',
        container: 'container-class'
      },

      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
        const barProgress = Swal.getPopup()?.querySelector(".swal2-timer-progress-bar") as HTMLElement;

        barProgress!.style.backgroundColor = "red";

        // const barTime = Swal.getPopup()?.querySelector(".swal2-timer-progress-bar") as HTMLElement;
        // barTime!.style.backgroundColor = "red";
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });

    return timerInterval;
  }


  public alertNotificationProgress(options: { title: string, icon: any, message: string, duration?: number, position?: any, color?: any }) {

    const Toast = Swal.mixin({
      toast: true,
      position: options.position || "top-end",
      showConfirmButton: false,
      timer: options.duration || 3000,
      timerProgressBar: true,
      customClass: {
        timerProgressBar: "swal2-timer-progress-bar"
      },
      didOpen: (toast) => {
        const barProgress = Swal.getPopup()?.querySelector(".swal2-timer-progress-bar") as HTMLElement;

        barProgress!.style.backgroundColor = options.color ? options.color : "red";
        toast.onmouseleave = Swal.resumeTimer;
      }

    });

    Toast.fire({
      icon: options.icon,
      title: options.title,
      text: options.message
    }).then((result) => {

    });


  }

}
