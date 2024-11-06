import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Jobs {
  title: string;
  textEN: string;
  id: number;
  translations: { language: string, translatedText: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private httpClient = inject(HttpClient);

  getAllJobs() {
    return firstValueFrom(
      this.httpClient.get<Jobs[]>('http://localhost:3000/ads')
    );
  }

  deleteJobById(id: number) {
    return firstValueFrom(
      this.httpClient.delete(`http://localhost:3000/ads/${id}`)
    );
  }

  getJobById(id: number) {
    return firstValueFrom(
      this.httpClient.get<Jobs>(`http://localhost:3000/ads/${id}`)
    );
  }

  updateJob(id: number, editableTextEN: string) {
    return firstValueFrom(
      this.httpClient.patch(`http://localhost:3000/ads/${id}`, { textEN: editableTextEN })
    );
  }

  putTranslation(id: number, language: string, translatedText: string) {
    return firstValueFrom(
      this.httpClient.put(`http://localhost:3000/ads/${id}/translations/${language}`, { translatedText: translatedText })
    );
  }

  deleteTranslation(id: number, language: string) {
    return firstValueFrom(
      this.httpClient.delete(`http://localhost:3000/ads/${id}/translations/${language}`)
    );
  }

  autoTranslate(text: string, source_lang: string, target_lang: string): Promise<string> {
    return firstValueFrom(
      this.httpClient.post<{ translation: string }>('http://localhost:3000/deepl/v2/translate', {
        text: text,
        source_lang: source_lang,
        target_lang: target_lang
      })
    ).then(response => response.translation);
  }

}
