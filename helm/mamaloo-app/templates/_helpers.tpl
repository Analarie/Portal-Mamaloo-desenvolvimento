{{- define "mamaloo-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mamaloo-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "mamaloo-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mamaloo-app.labels" -}}
helm.sh/chart: {{ include "mamaloo-app.chart" . }}
{{ include "mamaloo-app.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Values.labels }}
{{ toYaml .Values.labels }}
{{- end }}
{{- end }}

{{- define "mamaloo-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "mamaloo-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "mamaloo-app.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "mamaloo-app.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "mamaloo-app.database.url" -}}
postgresql://{{ .Values.database.user }}:{{ .Values.database.password }}@{{ include "mamaloo-app.fullname" . }}-database:{{ .Values.database.port }}/{{ .Values.database.database }}
{{- end }}
