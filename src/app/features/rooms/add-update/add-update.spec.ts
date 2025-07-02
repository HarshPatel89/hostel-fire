import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdate } from './add-update';

describe('AddUpdate', () => {
  let component: AddUpdate;
  let fixture: ComponentFixture<AddUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
