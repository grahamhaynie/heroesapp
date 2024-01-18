import { Component, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Hero, HeroForm } from '../hero';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})

export class HeroDetailComponent {
  hero: Hero;
  heroForm!: FormGroup; // exclamation mark is non null operator - can't be null
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private heroService: HeroService,
    private location: Location,
    public fb: FormBuilder
  ) {
    this.hero = new HeroForm(0, "someone", "else", "something");
  }

  ngOnInit(): void {
    this.heroForm = new FormGroup({
      name: new FormControl(this.hero.name, Validators.required),
      alterEgo: new FormControl(this.hero.alterEgo),
      power: new FormControl(this.hero.power, Validators.required),
      image: new FormControl('')
    });
    this.getHero();
  }
  
  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => {
        this.hero = hero;
        this.heroForm.patchValue(hero);
      }
    );
  }

  onFileSelect(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files.item(0);
  
      if (file && this.isImageFile(file)) {
        this.selectedFile = file;
      }
    }
  }

  isImageFile(file: File): boolean {
    return file.type === 'image/jpeg';
  }

  goBack(): void {
    this.location.back();
  }

  get name() { return this.heroForm.get('name')!; }

  get power() { return this.heroForm.get('power')!; }

  get alterEgo() { return this.heroForm.get('alterEgo')!; }

  save(): void {
    if (!this.heroForm.valid) {
        false;
    } else if (this.hero) {
      const id = this.hero.id;
      const url = this.hero.photoURL;
      this.hero = this.heroForm.getRawValue();
      this.hero.id = id;

      if(this.selectedFile){

        this.heroService.uploadHeroPhoto(this.selectedFile, id)
        .subscribe((url) => {
          console.log(url);
          this.messageService.add({
            severity: 'success', 
            summary: `Suscess`,
            detail: "Uploaded hero photo",
            life: 3000 
            
          });
          this.hero.photoURL = url;
          this.heroService.updateHero(this.hero)
          .subscribe(() => this.goBack());
        });
        
      } else {
        this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
      }
      }
  }

}