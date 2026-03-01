import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,  // Para leer parámetros de la URL
    private router: Router,                  // Para navegar si algo sale mal
  ) {}

  ngOnInit(): void {

    // Escuchamos los parámetros de la ruta
    this.activatedRoute.params
      .pipe(
        delay(500),

        /*
        Extraemos el id del objeto { id }
        y llamamos al servicio con ese id
        */
        switchMap( ({ id }) =>
          this.heroService.getHeroById(id)
        ),

      )
      .subscribe( hero => {

        /*
        Si no existe el héroe (undefined),
        redirigimos al listado
        */
        if (!hero) {
          return this.router.navigate(['heroes/list']);
        }

        // Si sí existe, lo guardamos en la propiedad
        this.hero = hero;

        console.log(this.hero);

        return;

      });

  }

  goBack(): void {
    this.router.navigateByUrl('/heroes/list')
  }

}
