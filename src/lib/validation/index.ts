export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * 납품 내역 입력값을 검증합니다.
 */
export function validateDelivery(data: {
  productName: string;
  vendorName: string;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  unitSalePrice: number;
  requestedAt: string;
  arrivedAt?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.productName || data.productName.trim() === '') {
    errors.push({ field: 'productName', message: '물품명을 입력해주세요.' });
  }

  if (!data.vendorName || data.vendorName.trim() === '') {
    errors.push({ field: 'vendorName', message: '업체명을 입력해주세요.' });
  }

  if (!data.quantity || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
    errors.push({ field: 'quantity', message: '수량은 0보다 큰 정수여야 합니다.' });
  }

  if (data.unitPrice < 0) {
    errors.push({ field: 'unitPrice', message: '개당 원가는 음수가 될 수 없습니다.' });
  }

  if (data.deliveryFee < 0) {
    errors.push({ field: 'deliveryFee', message: '배송료는 음수가 될 수 없습니다.' });
  }

  if (data.unitSalePrice < 0) {
    errors.push({ field: 'unitSalePrice', message: '개당 단가는 음수가 될 수 없습니다.' });
  }

  if (!data.requestedAt) {
    errors.push({ field: 'requestedAt', message: '요청일자를 선택해주세요.' });
  } else if (isNaN(new Date(data.requestedAt).getTime())) {
    errors.push({ field: 'requestedAt', message: '올바른 요청일자를 입력해주세요.' });
  }

  if (data.arrivedAt && isNaN(new Date(data.arrivedAt).getTime())) {
    errors.push({ field: 'arrivedAt', message: '올바른 도착일자를 입력해주세요.' });
  }

  if (data.requestedAt && data.arrivedAt) {
    const requested = new Date(data.requestedAt);
    const arrived = new Date(data.arrivedAt);
    if (arrived < requested) {
      errors.push({ field: 'arrivedAt', message: '도착일자는 요청일자보다 이전일 수 없습니다.' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 광고 물품 입력값을 검증합니다.
 */
export function validateProduct(data: {
  name: string;
  category: string;
  spec: string;
  unit: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: '물품명을 입력해주세요.' });
  }

  if (!data.category || data.category.trim() === '') {
    errors.push({ field: 'category', message: '물품 분류를 입력해주세요.' });
  }

  if (!data.unit || data.unit.trim() === '') {
    errors.push({ field: 'unit', message: '단위를 입력해주세요.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 업체 입력값을 검증합니다.
 */
export function validateVendor(data: {
  name: string;
  person: string;
  phone: string;
  email?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: '업체명을 입력해주세요.' });
  }

  if (!data.person || data.person.trim() === '') {
    errors.push({ field: 'person', message: '담당자를 입력해주세요.' });
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push({ field: 'phone', message: '연락처를 입력해주세요.' });
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: '올바른 이메일 형식이 아닙니다.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 납품 차수 입력값을 검증합니다.
 */
export function validateDeliveryRound(data: {
  name: string;
  status: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: '차수명을 입력해주세요.' });
  }

  if (!data.status || data.status.trim() === '') {
    errors.push({ field: 'status', message: '상태를 선택해주세요.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
