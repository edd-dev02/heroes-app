import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

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

  constructor(
    private herosService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  get currentHero(): Hero {

    const hero = this.heroForm.value as Hero;

    return hero;

  }

  // ¿Ruta para editar o para crear un héroe?
  ngOnInit(): void {

    if (!this.router.url.includes("edit")) return;

    // Si estamos en la ruta para editar...
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.herosService.getHeroById( id ) ),
      )
      .subscribe(
        hero => {

          // El héroe no existe (null), lo sacamos
          if (!hero) return this.router.navigateByUrl("/");

          // reset() tiene dos funciones, si mandamos un parámetro rellena los campos que se llamen igual que el modelo del backend
          this.heroForm.reset( hero );
          return;
        }
      )

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
