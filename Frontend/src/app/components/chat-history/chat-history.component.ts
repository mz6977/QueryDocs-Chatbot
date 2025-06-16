import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css']
})
export class ChatHistoryComponent {
  @Input() chatHistory: any[] = [];
  @Input() showSidebar: boolean = false;
  @Output() chatSelected = new EventEmitter<number>();
  @Output() newChat = new EventEmitter<void>();

  selectChat(index: number) {
    this.chatSelected.emit(index);
  }

  hideSidebar() {
    this.chatSelected.emit(-1);
  }

  startNewChat() {
    this.newChat.emit();
  }
}
