import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-poke',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container">
      <h2>httpResource demo — PokéAPI</h2>

      <label>
        Pokémon name:
        <input
          [value]="name()"
          (input)="name.set(($any($event.target).value || '').toLowerCase())"
          placeholder="pikachu"
        />
      </label>
      <button (click)="reload()">Reload</button>

      @if (pokemon.isLoading()) {
      <p>Loading…</p>
      } @else if (pokemon.error()) {
      <p class="error">Error: {{ pokemon.error() ?? pokemon.error() }}</p>
      } @else if (data()) {
      <article>
        <h3>{{ data()?.name | titlecase }} (id: {{ data()?.id }})</h3>
        <p>Base experience: {{ data()?.base_experience }}</p>
        <p>Height: {{ data()?.height }} — Weight: {{ data()?.weight }}</p>
      </article>
      }
    </section>
  `,
  styles: [
    `
      .container {
        padding: 1rem;
        max-width: 720px;
        margin: auto;
      }
      .error {
        color: #b00020;
      }
    `,
  ],
})
export class PokeComponent {
  name = signal('pikachu');
  pokemon = httpResource(() => ({
    url: `https://pokeapi.co/api/v2/pokemon/${this.name()}`,
    method: 'GET',
  }));

  data = computed(() => this.pokemon.value() as any);

  reload() {
    this.pokemon.reload();
  }
}
