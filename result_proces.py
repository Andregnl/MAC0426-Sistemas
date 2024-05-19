import json
import matplotlib.pyplot as plt
from statistics import mean, stdev
import csv
import numpy as np
import sys
import os

def open_json(source):
    file = open(source)
    json_data = json.load(file)
    file.close()
    return json_data

def convert_list_float(list):
    row = []
    for element in list:
        row.append(float(element))
    return row

def make_boxplot(source, chart_path):
    json_data = open_json(source)
    data = []
    for key in json_data:
        row = convert_list_float(json_data[key])
        data.append(row)

    plt.boxplot(data)
    plt.savefig(chart_path)
    plt.clf()

def make_barplot(source, chart_path):
    json_data = open_json(source)
    data = []
    for key in json_data:
        row = convert_list_float(json_data[key])
        data.append(row)

    plt.plot(json_data)
    plt.savefig(chart_path)
    

def get_consultas(json):
    consultas = []
    for consulta in json:
        consultas.append(consulta)
    return consultas


def make_table(source_mysql, source_postgres,table_path):
    json_mysql = open_json(source_mysql)
    json_postgres = open_json(source_postgres)
    
    mean_my, desvio_my = mean_desvio_p(json_mysql)
    mean_post, desvio_post = mean_desvio_p(json_postgres)
    
    names = get_consultas(json_mysql)
    fields = ['consultas','mean mysql', 'desvio padrão mysql', 'mean postgres', 'desvio padrão postgres']
    
    rows = [names, mean_my, desvio_my, mean_post, desvio_post]
    rows = np.matrix(rows).transpose().tolist()

    create_csv(fields,rows,table_path)
    

def create_csv(fields,rows,table_path):
    with open(table_path, 'w') as f:
        csv_writer = csv.writer(f)
        csv_writer.writerow(fields)
        csv_writer.writerows(rows)


def mean_desvio_p(json_data):
    means = []
    desvio_p = []
    for key in json_data:
        t_list = convert_list_float(json_data[key])
        means.append(mean(t_list))
        desvio_p.append(stdev(t_list))

    return means, desvio_p

def json_chart_path(source):
    path = source.replace("json","png")
    path = path.replace("results","chart")
    return path

def json_table_path(source):
    path = source.replace("json","csv")
    path = path.replace("results","table")
    return path

def get_json_files():
    roo = os.getcwd() + "/results"
    print(roo)
    files = []
    for arquivo in os.listdir(roo ):
            if arquivo.endswith(".json"):
                files.append(os.path.join(roo, arquivo))
    return files

def main():
    files = get_json_files()
    # file = 'results/con3BTree_My.json'
    # file = 'results/result_proces_sample.txt'
    for i,file in enumerate(files):
        # if i == 2:
        print(file)
        chart_path = json_chart_path(file)
        table_path = json_table_path(file)
        # make_barplot(file,'chart/chart2.png')
        make_boxplot(file,chart_path)
        make_table(file,file,table_path)
        # if i == 2:
        #     exit(0)



if __name__ =='__main__':
    main()




# Objeto{}