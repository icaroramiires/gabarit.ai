# Infraestrutura Gabarit.ai (GCP)

## Arquitetura Data Lakehouse

Esta estrutura foi desenhada para suportar ingestão de telemetria em tempo real e analytics avançado (TRI e Probabilidade de Aprovação).

### Componentes Core:
1.  **Google Pub/Sub**: Ingestão de eventos de telemetria (resolução de questões, tempo de estudo).
2.  **Cloud Dataflow (Apache Beam)**: Processamento e normalização dos dados em streaming.
3.  **Google Cloud Storage (Bronze Layer)**: Armazenamento de dados brutos (Raw Data).
4.  **BigQuery (Silver/Gold Layer)**: Data Warehouse para consulta de alta performance e modelagem de proficiência.
5.  **Vertex AI**: Treinamento de modelos preditivos de aprovação.

## Script de Ingestão (Placeholder Python)

```python
# infra/ingestion/pubsub_publisher.py
from google.cloud import pubsub_v1
import json

project_id = "gabarit-ai-prod"
topic_id = "telemetry-events"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

def publish_event(event_type: str, payload: dict):
    data = json.dumps({
        "event_type": event_type,
        "payload": payload,
        "timestamp": "2024-02-22T..." # ISO 8601
    }).encode("utf-8")
    
    future = publisher.publish(topic_path, data)
    return future.result()
```
