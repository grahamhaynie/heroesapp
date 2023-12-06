import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HeroService } from '../hero.service';
import { Hero, HeroForm } from '../hero';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css']
})
export class HeroFormComponent {
  hero: Hero;
  heroForm!: FormGroup;

  powers = ['Really Smart', 'Super Flexible',
  'Super Hot', 'Weather Changer'];

  constructor(
    private heroService: HeroService,
    private messageService: MessageService,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.hero = new HeroForm(0, "", "", "");
  }

  ngOnInit(): void {
    this.heroForm = new FormGroup({
      name: new FormControl(this.hero.name, Validators.required),
      alterEgo: new FormControl(this.hero.alterEgo),
      power: new FormControl(this.hero.power, Validators.required)
    });
  }

  changePower(e: any) {
    this.power?.patchValue(e.target.value, {
      onlySelf: true,
    });
  }

  get name() { return this.heroForm.get('name')!; }

  get power() { return this.heroForm.get('power')!; }

  get alterEgo() { return this.heroForm.get('alterEgo')!; }

  onSubmit() { 
    if (!this.heroForm.valid) {
        false;
    } else {

        this.hero = this.heroForm.getRawValue();

        console.warn(this.hero);

        this.heroService.addHero(this.hero)
        .subscribe(() => {
            this.messageService.add({
              severity: 'success', 
              summary: `Suscess`,
              detail: "added hero " + this.hero.name,
              life: 3000 
            });
            this.heroService.getHeroes();
        }
        );
        this.router.navigateByUrl("/heroes");

    }
   }

}