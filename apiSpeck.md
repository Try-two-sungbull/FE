
## 1. 템플릿 목록 조회

**Endpoint**: `GET /api/v1/agent/templates/retrieve`

**Parameters**:
- `template_type` (required): 템플릿 유형 (예: "적격심사", "소액수의")
- `limit` (optional): 조회 개수 (기본 10, 최대 50)

**Example**:
```bash
# 적격심사 템플릿 최신 10개
curl "http://localhost:8000/api/v1/agent/templates/retrieve?template_type=적격심사&limit=5"

# 소액수의 템플릿 최신 5개
curl "http://localhost:8000/api/v1/agent/templates/retrieve?template_type=소액수의&limit=5"
```

**Response**:
```json
{
  "total": 10,
  "template_type": "적격심사",
  "templates": [
    {
      "id": 1,
      "template_type": "적격심사",
      "version": "1.0.1",
      "summary": "예정가격 표현 업데이트",
      "created_at": "2025-12-19T10:30:00"
    }
  ]
}
```

---

## 2. 템플릿 상세 조회

**Endpoint**: `GET /api/v1/agent/templates/{template_id}`

**Example**:
```bash
curl "http://localhost:8000/api/v1/agent/templates/1"
```

**Response**:
```json
{
  "id": 1,
  "template_type": "적격심사",
  "version": "1.0.1",
  "summary": "예정가격 표현 업데이트",
  "created_at": "2025-12-19T10:30:00",
  "content": "# 입찰공고문\n\n..."
}
```