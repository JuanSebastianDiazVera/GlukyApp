import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  hablitarCampos: any = undefined;

  constructor(
    public http: HttpClient,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  get() {
    console.log(this.f);
  }

  async loginValidation() {
    const loading = await this.loadingController.create();
    loading.present();
    return new Promise(() => {
      this.http
        .get('assets/mocks/loginTest.json')
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((data: any) => {
          let passwordLogin = data[0].password;
          console.log(passwordLogin)
          let email_analizado = /^([^]+)@(\w+)/.exec(data[0].Correo);
          let emailAdmin = email_analizado.input;
          if (this.f.email.value != emailAdmin) {
            const alertEmail = {
              cssClass: 'sweetAlert1',
              message: `<div style="width: 100%; text-align:center;"><p>Email incorrecto</p></div>`,
              buttons: [
                {
                  text: 'Cerrar',
                  role: 'cancel',
                  cssClass: 'btn-Cerrar',
                },
              ],
            };
            this.showAlert(alertEmail);
          }else if(this.f.password.value != passwordLogin){
            const alertPassword = {
              cssClass: 'sweetAlert1',
              message: `<div style="width: 100%; text-align:center;"><p>Contraseña incorrecta</p></div>`,
              buttons: [
                {
                  text: 'Cerrar',
                  role: 'cancel',
                  cssClass: 'btn-Cerrar',
                },
              ],
            };
            this.showAlert(alertPassword);
          } 
          else {
            this.hablitarCampos = true;
          }
        });
    });
  }

  async showAlert(options) {
    const alert = await this.alertController.create({
      header: options.header,
      subHeader: options.subHeader,
      message: options.message,
      buttons: options.buttons,
      cssClass: options.cssClass,
    });
    await alert.present();
  }

  cancelarButton() {
    this.hablitarCampos = !this.hablitarCampos;
  }
}
