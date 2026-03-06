import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  // Nota: Cuando trabajamos con formularios reactivos, la mayor parte de la lógica ira en el archivo del componente y no en la plantilla

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }), // No se toleran valores null para este campo
    publisher: new FormControl<Publisher>(Publisher.DCComics), // Valor por defecto
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),

    // Si es un campo númerico: campo: new FormControl(0)
  });

  public publishers = [
    {
      id: "DC Comics",
      value: "DC - Comics"
    },
    {
      id: "Marcel Comics",
      value: "Marvel - Comics"
    },
  ];

  constructor( private herosService: HeroesService ) {}

  get currentHero(): Hero {

    const hero = this.heroForm.value as Hero;

    return hero;

  }

  onSubmit(): void {

    if(this.heroForm.invalid) return;

    // Si tiene id, significa que quiere actualizar un heroe existente
    if(this.currentHero.id) {
      this.herosService.updateHero( this.currentHero )
        .subscribe( hero => {

          // TODO: Mostrar snackbar



        } );

        return;
    }

    // Si no tiene id, significa que quiere crear un héroe nuevo
    this.herosService.addHero( this.currentHero )
      .subscribe( hero => {
        //TODO: Mostrar snackbar, y navegar a /heroes/edit/hero.id
      } );

  }

}
