import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('quiz-desiree');

  // Preguntas del usuario (convertidas a formato interno)
  // Define a Question shape so we can add `correct` text safely
  
  
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    correct?: string;
  }[] = [
    {
      question: '¿Cuál es la primera película que vimos juntos?',
      options: ['Harry Potter', 'Minions', 'Spider-Man', 'Rompe Ralph'],
      correctIndex: 0,
    },
    {
      question: '¿Cuál es mi película favorita de Marvel?',
      options: ['Iron Man 1', 'Spider-Man 2 2', 'Guardianes de la Galaxia 1', 'Capitán América 1'],
      correctIndex: 3,
    },
    {
      question: '¿Los viernes son de ?',
      options: ['spaghetti', 'macarrones', 'lasaña', 'pizza'],
      correctIndex: 1,
    },
    {
      question: '¿Cuál es mi videojuego favorito?',
      options: ['Minecraft', 'God of War', 'Pokemon', 'Fortnite'],
      correctIndex: 2,
    },
    {
      question: '¿Cuál es la primera comida que comiste de mi abuela?',
      options: ['Lasaña', 'Cocido', 'Albondigas', 'Tortilla'],
      correctIndex: 2,
    },
    {
      question: '¿Cuál fue nuestro primer viaje juntos?',
      options: ['Madrid', 'Cádiz', 'Mérida', 'A Coruña'],
      correctIndex: 0,
    },
    {
      question: '¿Cuál fue la linea de bus que cogimos en Madrid?',
      options: ['173', '137', '152', '90'],
      correctIndex: 2,
    },
    {
      question: '¿Cuál es mi mote favorito?',
      options: ['Tontilla', 'Desiron', 'Desirilla', 'Amorcillo'],
      correctIndex: 2,
    },
    {
      question: '¿Cuál es mi cantante favorito?',
      options: ['Taylor Swift', 'Joaquin Sabina', 'Bad Bunny', 'Julio Madrid'],
      correctIndex: 1,
    },
   {
      question: '¿Cuál es mi jugador preferido sin contar a messi?',
      options: ['Pedri', 'Raphinha', 'Xavi', 'Busquets'],
      correctIndex: 3,  // Cambia esto: 0=Pedri, 1=Raphinha, 2=Xavi, 3=Busquets
    },
    {
      question: '¿Cuál de estás comidas no comimos en Cádiz?',
      options: ['Arroz de Verduras', 'Pescado Frito', 'Pizza', 'Croquetas'],
      correctIndex: 0,
    },
    {
      question: '¿Cuál es nuestro sitio de hamburguesas favorito?',
      options: ['McDonalds', 'Burger King', 'Five Guys', '13 Junio'],
      correctIndex: 3,
    },
    {
      question: '¿Que jugador del Barca lleva el 11?',
      options: ['Lamine', 'Raphinha', 'Lewandowski', 'Ferran'],
      correctIndex: 1,
    },
    {
      question: '¿Cuanto te quiero?',
      options: ['Mucho', 'Poco', 'Infinito', 'Más infinito siempre que tú'],
      correctIndex: 3,
    }
  ];

  constructor() {
    // Validate questions to avoid out-of-bounds correctIndex errors
    this.questions.forEach((q, i) => {
      const maxIdx = q.options?.length ? q.options.length - 1 : -1;
      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > maxIdx) {
        const fixed = Math.max(0, Math.min(maxIdx, Number.isFinite(q.correctIndex) ? q.correctIndex : 0));
        // fallback to last option if provided index is invalid
        q.correctIndex = fixed >= 0 ? fixed : 0;
        console.warn(`Question ${i} had invalid correctIndex; adjusted to ${q.correctIndex}`);
      }
      // Also set the canonical correct answer text for robust comparisons
      q.correct = q.options && q.options[q.correctIndex] ? q.options[q.correctIndex] : undefined;
    });
  }

  current = signal(0);
  score = signal(0);
  // Keep track of answered question indexes to avoid double-scoring
  answered = signal<Record<number, number>>({});
  // Control prize reveal modal
  showPrizeModal = signal(false);
  // Control instructions modal (show on page load)
  showInstructions = signal(true);

  selectOption(optionIndex: number) {
    const idx = this.current();
    const already = this.answered()[idx] !== undefined;
    if (!already) {
      const selectedText = this.questions[idx].options[optionIndex];
      const correctText = this.questions[idx].correct ?? this.questions[idx].options[this.questions[idx].correctIndex];
      const isCorrect = selectedText === correctText;
      if (isCorrect) {
        this.score.set(this.score() + 1);
      }
      const copy = { ...this.answered() };
      copy[idx] = optionIndex;
      this.answered.set(copy);
    }

    // move to next question (or finish)
    const next = idx + 1;
    if (next < this.questions.length) {
      this.current.set(next);
    } else {
      // mark finished by setting current to questions.length
      this.current.set(this.questions.length);
    }
  }

  restart() {
    this.current.set(0);
    this.score.set(0);
    this.answered.set({});
    this.showPrizeModal.set(false);
  }

  revealPrize() {
    this.showPrizeModal.set(true);
  }

  closeModal() {
    this.showPrizeModal.set(false);
  }

  closeInstructions() {
    this.showInstructions.set(false);
  }

  get percent() {
    if (!this.questions.length) return 0;
    return Math.round((this.score() / this.questions.length) * 100);
  }
}
