import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resource } from '@angular/core';

type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container">
      <h1>Angular 19 — Signals + Resource (request/loader)</h1>

      <label>
        User ID:
        <input type="number" [value]="userId()" (input)="userId.set(+$any($event.target).value)" min="1" />
      </label>

      <button (click)="reloadPosts()">Reload</button>

      @if (postsRes.isLoading()) {
        <p>Loading posts…</p>
      } @else if (postsRes.error()) {
        <p class="error">Error: {{ postsRes.error() ?? postsRes.error() }}</p>
      } @else {
        <ul>
          @for (p of posts(); track p.id) {
            <li>
              <strong>#{{ p.id }}</strong> — {{ p.title }}
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [`
    .container { padding: 1rem; max-width: 720px; margin: auto; }
    .error { color: #b00020; }
    ul { line-height: 1.6; }
    input { width: 120px; margin-inline: .5rem; }
  `]
})
export class HomeComponent {
  // signal điều khiển tham số
  userId = signal<number>(1);

  // Resource với request & loader
  postsRes = resource({
    // request là một hàm tạo "payload" dựa trên signals đầu vào
    request: () => ({ uid: this.userId() }),
    // loader thực thi async fetch dựa trên request + abortSignal
    // (abortSignal giúp tự cancel khi tham số đổi)
    loader: async ({ request, abortSignal }): Promise<Post[]> => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${request.uid}`,
        { signal: abortSignal }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }
  });

  // computed lấy value từ resource
  posts = computed(() => this.postsRes.value() ?? []);

  // Reload thủ công (ngoài auto-trigger khi userId thay đổi)
  reloadPosts() {
    this.postsRes.reload();
  }

  // optional: effect log
  _log = effect(() => {
    if (this.postsRes.status() === 2) return;
    console.log('Status:', this.postsRes.status(), 'Count:', this.posts().length);
  });
}
