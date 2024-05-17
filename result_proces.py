import json
import matplotlib.pyplot as plt
from statistics import mean, stdev
import csv
import numpy as np

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

def main():
    file = 'results/result_proces_sample.txt'
    make_barplot(file,'chart/chart2.png')
    # make_boxplot(file,'chart/chart1.png')
    make_table(file,file,'table/table.csv')


if __name__ =='__main__':
    main()
