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

def make_boxplot2(searchByOpJsonObj):
    i = 0
    for qry, values in searchByOpJsonObj.items():
        pgData = values['Pg']
        mySqlData = values['MySql']

        fig, ax = plt.subplots()
        val = pgData.values()
        val = [convert_list_float(x) for x in val]
        for timeArr in val:
            if (timeArr == []):
                timeArr.append(0)

        ax.boxplot(val)
        ax.set_xticklabels(pgData.keys())
        ax.set_title(qry)
        plt.close(fig)
        fig.savefig('./compareSameOpInDiffCenarios/' + str(i) + '.png')
        i = i + 1

def make_boxplot(source, chart_path, title):

    boxwidth = 0.25

    print(source)

    json_data = open_json(source)
    data = []
    labels = []
    with open("output.txt","w") as file:
        for key in json_data:
            row = convert_list_float(json_data[key])
            data.append(row)
            labels.append(key)
            for element2 in row:
                file.write(str(element2))
                file.write("\n")
            file.write("new")
    file.close()

    plt.boxplot(data,widths=boxwidth)

    plt.xlabel('Testes ', fontsize = 15)
    plt.ylabel('Execution Time (sec)', fontsize = 15)
    plt.title(title)

    plt.savefig(chart_path)
    plt.clf()

def make_barplot(source, chart_path):
    json_data = open_json(source)
    print(json_data["Pg"].keys())

    pgData = []
    mySqlData = []
    pgMean = []
    mySqlMean = []
    for bd in json_data.keys():
        for index in json_data[bd].keys():
            for consultas in json_data[bd][index]:
                for query, timeArray in consultas.items():
                    timeArray = convert_list_float(timeArray)
                    m = mean(timeArray)
                    if (bd == 'Pg'):
                        pgMean.append(m)
                    elif (bd == 'MySql'):
                        mySqlMean.append(m)
            if (bd == 'Pg'):
                if len(pgMean) <= 0:
                    pgData.append(0)                    
                else:
                    pgData.append(mean(pgMean))
            elif (bd == 'MySql'):
                if len(mySqlMean) <= 0:
                    mySqlData.append(0)
                else:
                    mySqlData.append(mean(mySqlMean))
                    #print(bd + " | " + index + " | " + query + " " + str(m) + " " + str(d))

    print(len(mySqlData), len(pgData))
    barwidth = 0.25

    # mySqlData = [1,2,3,4]
    # pgData = [1,2,3,4]

    br1 = np.arange(len(mySqlData)) 
    br2 = [x + barwidth for x in br1] 

    plt.bar(br1,list(mySqlData), color = "blue", width = barwidth)
    plt.bar(br2,list(pgData),color = "red", width = barwidth)

    plt.xlabel('Testes', fontweight ='bold', fontsize = 15) 
    plt.ylabel('Execution Time', fontweight ='bold', fontsize = 15) 
    
    labels = json_data[bd].keys()
    
    plt.xticks([r + barwidth for r in range(len(mySqlData))], labels)
    
    plt.legend(("my","pg"))
    plt.savefig(chart_path)
    plt.clf()


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
    
    mean_my = [str(value).replace('.', ',') for value in mean_my]
    desvio_my = [str(value).replace('.', ',') for value in desvio_my]

    mean_post= [str(value).replace('.', ',') for value in mean_post]
    desvio_post= [str(value).replace('.', ',') for value in desvio_post]

    names = get_consultas(json_mysql)
    fields = ['consultas','mean mysql', 'desvio padrão mysql', 'mean postgres', 'desvio padrão postgres']

    rows = [names, mean_my, desvio_my, mean_post, desvio_post]
    rows = np.matrix(rows).transpose().tolist()

    create_csv(fields,rows,table_path)


def create_csv(fields,rows,table_path):
    with open(table_path, 'w') as f:
        csv_writer = csv.writer(f, delimiter = ';')
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

def get_json_files(path):
    files = []
    for arquivo in os.listdir(path):
            if arquivo.endswith(".json"):
                files.append(os.path.join(path, arquivo))
    return files

def chart_title(file, file_path):
    name = file.replace(file_path + "/","").replace(".json","")
    name = name.replace("con"," Item:")
    name = name.replace("Hash"," Index:Hash").replace("NoIndex"," Index:NoIndex").replace("Btree"," Index:Btree").replace("FullTextIndex"," Index:FullText")
    name = name.replace("_My"," Bd:MySQL").replace("_Pg"," Bd:Postgres")
    return name


def main():
    file_path = os.getcwd() + "/results2"
    files = get_json_files(file_path)
    for i,file in enumerate(files):
        chart_path = json_chart_path(file)
        name = chart_title(file, file_path)
        make_boxplot(file,chart_path, name)

    # path = "/results2"
    # files = get_json_files(path)
    # for i, file in enumerate(files):
    #     table_path = json_table_path(file)
    #     make_table(file,file,table_path)

    # file = '/home/gu/git/MAC0426-Sistemas/organizedResults/enviromentSearch.json'
    # chart_path= json_chart_path(file)
    # make_barplot(file,chart_path)

def extractBoxplotFromData(data, qry, index, folderName):
    fig, ax = plt.subplots()
    val = data.values()
    val = [convert_list_float(x) for x in val]
    for timeArr in val:
        if (timeArr == []):
            timeArr.append(0)

    ax.boxplot(val)
    ax.set_xticklabels(data.keys())
    ax.set_title(qry)
    plt.close(fig)
    fig.savefig('./compareSameOpInDiffCenarios/' + folderName + '/' + str(index) + '.png')


def make_boxplot2(searchByOpJsonObj):
    i = 0
    for qry, values in searchByOpJsonObj.items():
        pgData = values['Pg']
        mySqlData = values['MySql']

        extractBoxplotFromData(pgData, qry, i, 'Pg')
        extractBoxplotFromData(mySqlData, qry, i, 'MySql')

        i = i + 1
 
def main2():
    f = open('./organizedResults/operationSearch.json')
    jsonObj = json.load(f)
    make_boxplot2(jsonObj)

if __name__ =='__main__':
    main2()
