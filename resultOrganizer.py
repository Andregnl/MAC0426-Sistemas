from os import listdir
from os.path import isfile, join
import json

resultFilePath = './results'
fileList = [f for f in listdir(resultFilePath) if isfile(join(resultFilePath, f))]

newResultByOperation = {}
newResultByEnviroment = { 'Pg': {'BTree': [], 'Hash': [], 'NoIndex': []}, 
                          'MySql': {'BTree': [], 'Hash': [], 'NoIndex': []}}

def main():
    organizeByEnviroment(fileList)

def writeJson(dict, path):
    json_object = json.dumps(dict, indent=4)

    with open(path, "w") as outfile:
	    outfile.write(json_object)

def organizeByOperation(fileList):
    allJsonFiles = []
    for f in fileList:
        file = open(join(resultFilePath, f))
        data = file.json.load(file)
        allJsonFiles.append(data)
        file.close()
    
    for data in allJsonFiles:
        for operation in data:
                newResultByOperation[operation] = {'Pg': { 'BTree': [], 'Hash': [], 'NoIndex': []}, 
                                                   'MySql': { 'BTree': [], 'Hash': [], 'NoIndex': [] }}
    
    for f in fileList:
        if ('my' in f.lower()):
            if ('BTree' in )
        elif ('pg' in f.lower()):
            sortFile(f, 'Pg')
       

def organizeByEnviroment(fileList):
    for f in fileList:
        if ('my' in f.lower()):
            sortFile(f, 'MySql')
        elif ('pg' in f.lower()):
            sortFile(f, 'Pg')
    
    writeJson(newResultByEnviroment, './organizedResults/enviromentSearch.json')

#Separa entre BTREE, HASH e NOINDEX
def sortFile(fileName, db):
    file = open(join(resultFilePath, fileName))
    data = json.load(file)
    file.close()

    if ('BTree' in fileName):
        for operation, times in data.items():
            newResultByEnviroment[db]['BTree'].append({ operation: times })
        
    elif ('Hash' in fileName):
        for operation, times in data.items():
            newResultByEnviroment[db]['Hash'].append({ operation: times })

    

main()
#for consulta in obj['selec...']['PG']
        
#for cenário in obj['BTree']