{{- define "mamaloo-app.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mamaloo-app.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "mamaloo-app.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mamaloo-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mamaloo-app.labels" -}}
helm.sh/chart: {{ include "mamaloo-app.chart" . }}
{{ include "mamaloo-app.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "mamaloo-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "mamaloo-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "mamaloo-app.serviceAccountName" -}}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}

{{- define "mamaloo-app.database.url" -}}
postgresql://{{ .Values.database.user }}:{{ .Values.database.password }}@{{ include "mamaloo-app.fullname" . }}-database:{{ .Values.database.port }}/{{ .Values.database.database }}
{{- end }}
