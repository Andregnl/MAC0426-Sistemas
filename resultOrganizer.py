from os import listdir
from os.path import isfile, join
import json

resultFilePath = './results2'
fileList = [f for f in listdir(resultFilePath) if isfile(join(resultFilePath, f))]

newResultByOperation = {}
newResultByEnviroment = { 'Pg': {'BTree': [], 'Hash': [], 'NoIndex': [], 'FullTextIndex': []}, 
                          'MySql': {'BTree': [], 'Hash': [], 'NoIndex': [], 'FullTextIndex': []}}

def main():
    organizeByEnviroment(fileList)
    organizeByOperation(fileList)

def writeJson(dict, path):
    json_object = json.dumps(dict, indent=4)

    with open(path, "w") as outfile:
	    outfile.write(json_object)

def organizeByOperation(fileList):
    allJsonFiles = []
    for f in fileList:
        file = open(join(resultFilePath, f))
        data = json.load(file)
        allJsonFiles.append(data)
        file.close()
    
    for data in allJsonFiles:
        for operation in data:
                newResultByOperation[operation] = {'Pg': { 'BTree': [], 'Hash': [], 'NoIndex': [], 'FullTextIndex': []}, 
                                                   'MySql': { 'BTree': [], 'Hash': [], 'NoIndex': [], 'FullTextIndex': []}}
    
    for f in fileList:
        if ('my' in f.lower()):
            sortFileByOperation(f, 'MySql')
        elif ('pg' in f.lower()):
            sortFileByOperation(f, 'Pg')
    
    writeJson(newResultByOperation, './organizedResults/operationSearch.json')

def organizeByEnviroment(fileList):
    for f in fileList:
        if ('my' in f.lower()):
            sortFileByEnviroment(f, 'MySql')
        elif ('pg' in f.lower()):
            sortFileByEnviroment(f, 'Pg')
    
    writeJson(newResultByEnviroment, './organizedResults/enviromentSearch.json')

#Separa entre BTREE, HASH e NOINDEX
def sortFileByEnviroment(fileName, db):
    file = open(join(resultFilePath, fileName))
    data = json.load(file)
    file.close()

    if ('BTree' in fileName):
        for operation, times in data.items():
            newResultByEnviroment[db]['BTree'].append({ operation: times })
        
    elif ('Hash' in fileName):
        for operation, times in data.items():
            newResultByEnviroment[db]['Hash'].append({ operation: times })
    
    elif ('NoIndex' in fileName):
        for operation, times in data.items():
            newResultByEnviroment[db]['NoIndex'].append({ operation: times })
    
    elif ('FullTextIndex' in fileName):
        for operation, times in data.items():
            newResultByEnviroment[db]['FullTextIndex'].append({ operation: times })

def sortFileByOperation(fileName, db):
    file = open(join(resultFilePath, fileName))
    data = json.load(file)
    file.close()

    if ('BTree' in fileName):
        for operation, times in data.items():
            newResultByOperation[operation][db]['BTree'] = times
        
    elif ('Hash' in fileName):
        for operation, times in data.items():
            newResultByOperation[operation][db]['Hash'] = times
    
    elif ('NoIndex' in fileName):
        for operation, times in data.items():
            newResultByOperation[operation][db]['NoIndex'] = times

    elif ('FullTextIndex' in fileName):
        for operation, times in data.items():
            newResultByOperation[operation][db]['FullTextIndex'] = times

main()
#for consulta in obj['selec...']['PG']
        
#for cenário in obj['BTree']