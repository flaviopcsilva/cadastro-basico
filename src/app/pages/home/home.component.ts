import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loginForm: FormGroup;
  notification = { message: '', success: true };

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.http.post('https://base-cadastrocompleto-backend.onrender.com/login', loginData).subscribe(
        (response: any) => {
          const token = response.token;
          const expiresIn = 180; // Supondo que o backend retorna a expiração

          localStorage.setItem('token', token);
          localStorage.setItem('expiresIn', (new Date().getTime() + expiresIn * 1000).toString()); // Converter para string
          console.log(token);
          console.log(expiresIn);


          this.showNotification('Login bem-sucedido!', true);

          setTimeout(() => {
            this.router.navigate(['principal']);
          }, 4000);
        },
        error => {
          this.showNotification(`Erro ao fazer login: ${error.error.mensagem}`, false);
        }
      );
    } else {
      this.showNotification('Formulário inválido!', false);
    }
  }

  showNotification(message: string, success: boolean): void {
    this.notification.message = message;
    this.notification.success = success;

    const notificationElement = document.querySelector('.notification');
    if (notificationElement) {
      notificationElement.classList.add('show');

      setTimeout(() => {
        notificationElement.classList.remove('show');
      }, 8000);
    }
  }
}
