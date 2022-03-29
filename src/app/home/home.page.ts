import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  data = [1,2,3,4,5,6]
  dateRoles: Array<any> = [];

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.consultaRoles();
  }

  async consultaRoles(){
    const loading = await this.loadingController.create();
    loading.present();
    return new Promise(() => {
      this.http
        .get('assets/mocks/rolesInternos.json')
        .pipe(finalize(() => loading.dismiss()))
        .pipe(map((generalidades: any) => generalidades.roles))
        .subscribe((data: any) => {
          this.dateRoles = data;
        });
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.data.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
