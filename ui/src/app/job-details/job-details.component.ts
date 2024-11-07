import { Component, signal } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { JobService } from '../job.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface Jobs {
  title: string;
  textEN: string;
  id: number;
  translations: { language: string, translatedText: string }[];
}

interface newTranslation{
  language: string;
  translatedText: string;
}

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [NgIf, FormsModule, NgForOf],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent {
  id: number = 0;
  jobAd = signal<Jobs | null>(null);
  translationDE = signal<string | null>("");
  isEditing = signal<boolean>(false);
  editableTextEN: string = '';
  AllTranslations = signal<newTranslation[]>([]);

  newLanguage = signal<string>('');
  newTranslatedText = signal<string>('');
  deleteLanguage = signal<string>('')
  editableTitel: string = '';


  constructor(
    private readonly route: ActivatedRoute,
    private readonly jobService: JobService,
    private readonly router: Router
  ) {
    const idParam = this.route.snapshot?.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    this.getJobDetails();
  }

  async getJobDetails() {
      const response: Jobs = await this.jobService.getJobById(this.id);
      this.jobAd.set(response || null);

      const translation = response?.translations.find(t => t.language === 'DE');
      if (translation) {
        for(let translation of response.translations){
        const currentTranslations = this.AllTranslations();
        const newTranslation = {language: translation.language, translatedText: translation.translatedText};
        currentTranslations.push(newTranslation);
        this.AllTranslations.set(currentTranslations);
      }} else {
        this.translationDE.set("keine Übersetzung vorhanden");
      }
  }

  editJob() {
    this.isEditing.set(true);
    this.editableTextEN = this.jobAd()?.textEN || '';
    this.editableTitel = this.jobAd()?.title || '';
  }

  saveJob() {
    this.isEditing.set(false);
    this.jobAd.update(job => {
      if (job) {
        job.textEN = this.editableTextEN;
        job.title = this.editableTitel;
        return job;
      }
      return null;
    });
    this.jobService.updateJob(this.id, this.editableTextEN, this.editableTitel);
  }

  backToJobPage() {
    this.router.navigate(['/JobAds']);
  }

  submitTranslation() {
    const language = this.newLanguage();
    const translatedText = this.newTranslatedText();

    if (language) {
      if (translatedText) {
        const currentTranslations = this.AllTranslations();
        const newTranslation = {language: language, translatedText: translatedText};
        currentTranslations.push(newTranslation);
        this.AllTranslations.set(currentTranslations);
        this.jobService.putTranslation(this.id, language, translatedText).then(r => console.log(r));

        this.newLanguage.set('');
        this.newTranslatedText.set('');
        console.log(this.AllTranslations());
      }
    }
  }

  deleteTranslation() {
    const language = this.deleteLanguage();
    if (language) {
      console.log(language);
      const currentTranslations = this.AllTranslations();
      const newTranslations = currentTranslations.filter(t => t.language !== language);
      this.AllTranslations.set(newTranslations);
      this.jobService.deleteTranslation(this.id, language).then(r => console.log(r));
      this.deleteLanguage.set('');
    }
  }

  autoTranslate() {
    const text: string | undefined = this.jobAd()?.textEN;
    const source_lang = 'EN';
    const target_lang = this.newLanguage();

    if (!text || !target_lang) {
      console.error("Translation failed: Text or target language is missing.");
      return;
    }
    this.jobService.autoTranslate(text, source_lang, target_lang)
      .then(translation => {
        console.log("Translation result:", translation);
        this.newTranslatedText.set(translation);
      })
      .catch(error => {
        console.error("Error during auto-translation:", error);
      });
  }

}
