import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';

@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatHistoryComponent, HttpClientModule],
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css']
})
export class PromptComponent implements OnInit, AfterViewChecked {
  userPrompt = '';
  response = '';
  showSidebar = false;
  isLoading = true;

  chatHistory: any[] = [];
  currentSession: any = {
    title: '',
    messages: []
  };

  @ViewChild('chatWindow') private chatWindow!: ElementRef;
  private shouldScroll = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.isLoading = true;

    const savedChatHistory = localStorage.getItem('chatHistory');
    this.chatHistory = savedChatHistory ? JSON.parse(savedChatHistory) : [];

    if (this.chatHistory.length > 0) {
      this.currentSession = this.chatHistory[this.chatHistory.length - 1];
    } else {
      this.startNewChat();
    }

    this.isLoading = false;
  }

  submitPrompt(): void {
    if (this.userPrompt.trim()) {
      const prompt = this.userPrompt;

      this.currentSession.messages.push({
        role: 'user',
        text: prompt,
        timestamp: new Date()
      });

      // Set the chat title based on the first user message
      if (!this.currentSession.title) {
        this.currentSession.title = prompt.split(' ').slice(0, 5).join(' ') + '...'; // First few words
      }

      this.userPrompt = '';
      this.shouldScroll = true;

      this.http.post('http://127.0.0.1:5000/prompt', { prompt }).subscribe(
        (response: any) => {
          if (response && response.answer) {
            this.currentSession.messages.push({
              role: 'bot',
              text: response.answer.replace(/\\n/g, '\n'),
              timestamp: new Date()
            });
            this.shouldScroll = true;
            this.saveSession();
          } else {
            alert('Bot reply is missing or invalid.');
          }
        },
        (error) => {
          console.error('Error getting bot reply:', error);
          alert('Failed to get bot reply. Please try again.');
        }
      );
    }
  }

  startNewChat(): void {
    this.currentSession = {
      title: '',
      messages: []
    };
    this.chatHistory.push(this.currentSession);
    this.saveSession();
  }

  saveSession(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  loadChat(index: number): void {
    if (index === -1) {
      this.showSidebar = false;
      return;
    }

    this.currentSession = this.chatHistory[index];
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }, 0);
  }
}