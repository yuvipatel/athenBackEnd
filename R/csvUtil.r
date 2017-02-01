#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)
args

processCsv = function(inputFilePath, outputFilePath) {
  myData = read.csv(file=inputFilePath, header=TRUE, sep=",")

  myData$customColumn = "CSV Edited!"

  write.csv(myData, file = outputFilePath, col.names = TRUE,
            append = FALSE, row.names = FALSE, qmethod = escape)
}

if (length(args)==0) {
  stop("At least one argument must be supplied (input csv file, output csvfile).n", call.=FALSE)
} else if (length(args)==2) {
  processCsv(args[1], args[2])
}

