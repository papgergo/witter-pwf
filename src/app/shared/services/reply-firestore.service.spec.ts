import { TestBed } from '@angular/core/testing';

import { ReplyFirestoreService } from './reply-firestore.service';

describe('ReplyFirestoreService', () => {
  let service: ReplyFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
