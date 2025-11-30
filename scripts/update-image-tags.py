#!/usr/bin/env python3
"""
Script para atualizar tags de imagens no Helm values.
Este script deve ser executado manualmente ou por um processo separado do CI/CD.
"""

import re
import sys
import os
import argparse


def update_image_tag(values_file: str, tag: str, backend: bool = False, frontend: bool = False) -> bool:
    """
    Atualiza a tag da imagem no arquivo values.yaml
    
    Args:
        values_file: Caminho para o arquivo values.yaml
        tag: Nova tag da imagem
        backend: Se True, atualiza a tag do backend
        frontend: Se True, atualiza a tag do frontend
    
    Returns:
        True se o arquivo foi modificado, False caso contrário
    """
    try:
        with open(values_file, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Erro: Arquivo {values_file} não encontrado", file=sys.stderr)
        return False
    
    original_content = content
    
    if backend:
        # Atualiza a tag do backend
        pattern = r'(backend:\s+image:\s+repository:[^\n]+\s+tag:\s+)"[^"]+"'
        content = re.sub(pattern, r'\1"' + tag + '"', content, flags=re.MULTILINE | re.DOTALL)
        print(f"Atualizando tag do backend para: {tag}")
    
    if frontend:
        # Atualiza a tag do frontend
        pattern = r'(frontend:\s+image:\s+repository:[^\n]+\s+tag:\s+)"[^"]+"'
        content = re.sub(pattern, r'\1"' + tag + '"', content, flags=re.MULTILINE | re.DOTALL)
        print(f"Atualizando tag do frontend para: {tag}")
    
    if content != original_content:
        with open(values_file, 'w') as f:
            f.write(content)
        print(f"✓ Arquivo {values_file} atualizado com sucesso")
        return True
    else:
        print(f"⚠ Nenhuma alteração necessária em {values_file}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Atualiza tags de imagens Docker nos arquivos Helm values'
    )
    parser.add_argument(
        '--tag',
        required=True,
        help='Tag da imagem (ex: prod-abc1234 ou dev-xyz7890)'
    )
    parser.add_argument(
        '--environment',
        required=True,
        choices=['dev', 'prod'],
        help='Ambiente de destino'
    )
    parser.add_argument(
        '--backend',
        action='store_true',
        help='Atualizar tag do backend'
    )
    parser.add_argument(
        '--frontend',
        action='store_true',
        help='Atualizar tag do frontend'
    )
    parser.add_argument(
        '--values-file',
        help='Caminho personalizado para o arquivo values (opcional)'
    )
    
    args = parser.parse_args()
    
    if not args.backend and not args.frontend:
        print("Erro: Especifique pelo menos --backend ou --frontend", file=sys.stderr)
        sys.exit(1)
    
    # Define o arquivo values baseado no ambiente
    if args.values_file:
        values_file = args.values_file
    else:
        values_file = f"helm/mamaloo-app/values-{args.environment}.yaml"
    
    # Atualiza as tags
    updated = update_image_tag(
        values_file=values_file,
        tag=args.tag,
        backend=args.backend,
        frontend=args.frontend
    )
    
    if updated:
        print(f"\n✓ Tags atualizadas com sucesso!")
        print(f"\nPróximos passos:")
        print(f"1. Revisar as mudanças: git diff {values_file}")
        print(f"2. Fazer commit: git add {values_file} && git commit -m 'chore: update image tags to {args.tag}'")
        print(f"3. Fazer push: git push")
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
