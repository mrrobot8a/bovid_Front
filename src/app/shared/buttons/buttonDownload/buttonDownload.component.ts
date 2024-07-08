import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, input, signal } from '@angular/core';
import { MaterialModule } from '../../material/material.module';


@Component({
  selector: 'app-button-download',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
  ],


  templateUrl: './buttonDownload.component.html',
  styleUrl: './buttonDownload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDownloadComponent implements OnInit {
  ngOnInit(): void {
    console.log(this._isProgressActive);
    console.log(this._isPending);
    console.log(this._downloadProgress);
  }

  private _isProgressActive = false;
  private _isPending = false;
  private _downloadProgress = 0;

  @Output() downloadClicked: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      // Emitir el evento solo si el botón no está deshabilitado
      this.downloadClicked.emit();
    }
  }


  @Input() disabled: boolean = false;

  @Input() set downloadProgress(value: number) {
    console.log('downloadProgress', value);
    this._downloadProgress = value;
  }



  get downloadProgress(): number {
    console.log('downloadProgress', this._downloadProgress);
    return this._downloadProgress;
  }


  @Input() set isProgressActive(value: boolean) {
    this._isProgressActive = value;
  }


  @Input() set isPending(value: boolean) {
    this._isPending = value;
  }

  get isPending(): boolean {
    return this._isPending;
  }





}

